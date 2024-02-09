import { Router } from "../deps.js";
import * as mainController from "./controllers/mainController.js";
import * as questionController from "./controllers/questionController.js";
import * as registerationController from "./controllers/registerationController.js";
import * as loginController from "./controllers/loginController.js";
import * as questionApi from "./apis/questionApi.js";
const router = new Router();

router.get("/", mainController.showMain);

router.get("/topics", questionController.listTopics);
router.post("/topics", questionController.addTopic);
router.post("/topics/:tId/delete", questionController.deleteTopic);

router.get("/topics/:tId", questionController.listQuestionsByTopic);
router.post("/topics/:tId/questions", questionController.addQuestion);
router.post("/topics/:tId/questions/:qId/delete", questionController.deleteQuestion);

router.get("/topics/:tId/questions/:qId", questionController.listQuestionAnswerOptions);
router.post("/topics/:tId/questions/:qId/options", questionController.addQuestionAnswerOption);

router.get("/quiz", questionController.listQuizTopics);


router.get("/quiz/:tId", questionController.processTopicPick);

router.get("/quiz/:tId/questions/:qId", questionController.quizQuestion);



//add
router.post("/quiz/:tId/questions/:qId/options/:oId", questionController.checkAnswer);
router.get("/quiz/:tId/questions/:qId/correct", questionController.processAnswer);
router.get("/quiz/:tId/questions/:qId/incorrect", questionController.processAnswer);




router.post("/topics/:tId/questions/:qId/options/:oId/delete", questionController.deleteQuestionAnswerOption);

//api
router.get("/api/questions/random", questionApi.getRandomQuestionApi);
router.post("/api/questions/answer", questionApi.answerQuestionApi);


//register & login
router.get("/auth/register", registerationController.showRegistrationForm);
router.post("/auth/register", registerationController.registerUser);

router.get("/auth/login", loginController.showLoginForm);
router.post("/auth/login", loginController.processLogin);

router.get("/auth/logout", loginController.logout);



export { router };

//kysymysten lisääminen kesken
