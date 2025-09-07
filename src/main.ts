import Express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import adminRoutes from "./routes/admin.routes";
import athleteRoutes from "./routes/athleteRoutes";
import resultsRoutes from "./routes/results.routes";

const app = Express();

// --- Configuração do Servidor ---
app.use(cors({ origin: "*" }));
app.use(Express.json());

const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

// --- Estado da Competição em Memória ---
const laneToAthleteMap = new Map<number, string | number>();
const competitionState = new Map<string | number, number>();

// --- Estado do Timer em Memória ---
let timerInterval: NodeJS.Timeout | null = null;
let totalSeconds = 0;
let isRunning = false;
let initialTime = 0;

const startTimer = () => {
    if (isRunning || totalSeconds <= 0) return;

    isRunning = true;
    io.emit("timer-state", { totalSeconds, isRunning }); // Emit initial running state

    timerInterval = setInterval(() => {
        if (totalSeconds > 0) {
            totalSeconds--;
            io.emit("timer-state", { totalSeconds, isRunning });
        }

        if (totalSeconds <= 0) {
            stopTimer();
            io.emit("competition-finished");
        }
    }, 1000);
};

const stopTimer = () => {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    isRunning = false;
    io.emit("timer-state", { totalSeconds, isRunning });
};

const resetTimer = () => {
    stopTimer();
    totalSeconds = initialTime;
    io.emit("timer-state", { totalSeconds, isRunning: false });
};

// --- Rotas HTTP ---
app.use("/api/admin", adminRoutes);
app.use("/api/athlete", athleteRoutes);
app.use("/api/results", resultsRoutes);
app.get("/api/admin/get-reps", (req, res) => {
    res.json(Object.fromEntries(competitionState));
});

// --- Lógica do WebSocket ---
io.on("connection", (socket) => {
    console.log(`Cliente conectado: ${socket.id}`);

    // Envia o estado atual assim que um cliente se conecta
    socket.emit(
        "competition-state-update",
        Object.fromEntries(competitionState),
    );
    socket.emit("timer-state", { totalSeconds, isRunning });
    socket.emit("lanes-configured", Object.fromEntries(laneToAthleteMap));

    socket.on("start-competition", (data) => {
        io.emit("start-competition", data);
    });

    // Evento para configurar as raias e inicializar o estado
    socket.on(
        "setup-lanes",
        (setup: {
            lanes: { laneNumber: number; athleteId: string | number }[];
            timeTest: number;
        }) => {
            const { lanes, timeTest } = setup;
            competitionState.clear();
            laneToAthleteMap.clear();

            lanes.forEach(({ laneNumber, athleteId }) => {
                laneToAthleteMap.set(laneNumber, athleteId);
                competitionState.set(athleteId, 0); // Inicializa contagem em 0
            });

            // Configura o timer
            initialTime = timeTest * 60;
            resetTimer(); // Reseta para o novo tempo inicial

            console.log(
                "Raias configuradas e estado inicializado:",
                Object.fromEntries(competitionState),
            );
            // Transmite o estado inicial para todos
            io.emit(
                "competition-state-update",
                Object.fromEntries(competitionState),
            );
            // Transmite a configuração das raias para todos
            io.emit("lanes-configured", Object.fromEntries(laneToAthleteMap));
        },
    );

    // Eventos de controle do timer
    socket.on("start-timer", startTimer);
    socket.on("stop-timer", stopTimer);
    socket.on("reset-timer", resetTimer);

    // Evento para o admin atualizar uma repetição
    socket.on(
        "admin-update-rep",
        (data: { laneNumber: number; action: "increment" | "decrement" }) => {
            const { laneNumber, action } = data;
            const athleteId = laneToAthleteMap.get(laneNumber);

            if (athleteId !== undefined) {
                let currentReps = competitionState.get(athleteId) || 0;
                if (action === "increment") {
                    currentReps++;
                } else if (action === "decrement" && currentReps > 0) {
                    currentReps--;
                }
                competitionState.set(athleteId, currentReps);

                // Transmite o estado completo e atualizado para todos os clientes
                io.emit(
                    "competition-state-update",
                    Object.fromEntries(competitionState),
                );
            }
        },
    );

    socket.on("disconnect", () => {
        console.log(`Cliente desconectado: ${socket.id}`);
    });
});

// Exporta o estado para que os serviços possam acessá-lo ao salvar
export const getCompetitionState = () => competitionState;
export { app, httpServer, io };
