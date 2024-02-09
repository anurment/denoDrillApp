import * as questionService from "../../services/questionService.js";
import { validasaur } from "../../deps.js";

const textValidationRules = {
    text: [validasaur.required, validasaur.minLength(1)],
};

const addTopic = async ({ request, response, state, render }) => {
    const body = request.body({ type: "form" });
    const params = await body.value;
    const input = params.get("name");
    const [passes, errors] = await validasaur.validate(
        {text: input},
        textValidationRules,
    );
    if (!passes){
        //console.log(errors);
        render("topics.eta", {
            topics: await questionService.listTopics(),
            text: input,
            validationErrors: errors, 
        });
    } else{
        const user = await state.session.get("user");
        await questionService.addTopic(user.id, input);
        response.redirect("/topics");
    }
    
}; 

const deleteTopic = async ({params, response }) => {
    await questionService.deleteTopic(params.tId);
    response.redirect(`/topics`);
};


const listTopics = async ({ render }) => {
    render("topics.eta", { topics: await questionService.listTopics()});
};

const listQuestionsByTopic = async ({ params, render }) => {
    render("topic.eta", { 
        questions: await questionService.listQuestionsByTopic(params.tId),
        topicId: params.tId,
        topicName: await questionService.getTopicName(params.tId),
    }
    );
};

const addQuestion = async ({params, request, response, state, render }) => {    
    const body = request.body({ type: "form" });
    const formParams = await body.value;
    const input = formParams.get("question_text");
    const [passes, errors] = await validasaur.validate(
        {text: input},
        textValidationRules,
    );
    if (!passes){
        //console.log(errors);
        render("topic.eta", {
            questions: await questionService.listQuestionsByTopic(params.tId),
            topicId: params.tId,
            topicName: await questionService.getTopicName(params.tId),
            text: input,
            validationErrors: errors,

        });
    } else {
        const user = await state.session.get("user");
        await questionService.addQuestion(user.id, params.tId, input);  
        response.redirect(`/topics/${params.tId}`);  
    }
      
};
 
const deleteQuestion = async ({params, request, response }) => {
    await questionService.deleteQuestionById(params.qId);
    response.redirect(`/topics/${params.tId}`);
};

const addQuestionAnswerOption = async ({params, request, response, render}) => {
    const body = request.body({ type: "form" });
    const formParams = await body.value;
    const input = formParams.get("option_text");
    const [passes, errors] = await validasaur.validate(
        {text: input},
        textValidationRules,
    );
    if (!passes){
        render("question.eta", { 
            question: await questionService.getQuestionById(params.qId),
            answerOptions: await questionService.getQuestionAnswerOptions(params.qId),
            text: input,
            validationErrors: errors,
        }
        );

    } else {
        await questionService.addQuestionAnswerOption(params.qId, input , formParams.has("is_correct") );
        response.redirect(`/topics/${params.tId}/questions/${params.qId}`);
    }

};

const listQuestionAnswerOptions = async ({params, render}) => {
    //console.log(questionService.getQuestionAndAnswers())

    render("question.eta", { 
        question: await questionService.getQuestionById(params.qId),
        answerOptions: await questionService.getQuestionAnswerOptions(params.qId),
    }
    );

};

const deleteQuestionAnswerOption = async ({params, request, response}) => {
    await questionService.deleteQuestionAnswerOption(params.oId, params.qId);
    response.redirect(`/topics/${params.tId}/questions/${params.qId}`);

};

const listQuizTopics = async ({ render }) => {
    //const readyTopics = await questionService.getReadyTopics();
    //const unReadyTopics = await questionService.getUnReadyTopics();
    //console.log(unReadyTopics);
    const topics = await questionService.listTopics();
    topics.sort((a, b) => a.name.localeCompare(b.name));
    //console.log(topics);

    
    render("quizTopics.eta", { 
        topics: topics,
        }
        );
};

const processTopicPick = async ({params, response}) => {
    const randomQuestion = await questionService.getRandomQuestion(params.tId);
    //console.log(randomQuestion.length);
    if (randomQuestion) {
        //console.log("OK");
        response.redirect(`/quiz/${params.tId}/questions/${randomQuestion.question.id}`);
    } else {
        response.body = "No questions for this topic yet"
    }
};

const quizQuestion = async ({render, params}) => {

    const randomQuestion = await questionService.getRandomQuestion(params.tId);
    render("quizQuestion.eta", randomQuestion
    );

};

const checkAnswer = async ({params, response, state}) => {
    //const question = await questionService.getQuestionById(params.qId);
    const answer = await questionService.getAnswerOptionById(params.oId);
    const user = await state.session.get("user");
    await questionService.recordAnswer(user.id, answer.question_id, answer.id);
    if (answer.is_correct){
        response.redirect(`/quiz/${params.tId}/questions/${params.qId}/correct`)
    } else {
        response.redirect(`/quiz/${params.tId}/questions/${params.qId}/incorrect`)
    }



};

const processAnswer = async ({render, params, request}) => {
    const url = new URL(request.url);
    if (url.pathname.split("/").pop() == "incorrect") {
        const answers = await questionService.getCorrectAnswers(params.qId);
        render("processAnswer.eta", {
            tId: params.tId,
            correctAnswers: answers,
        }
        );
    } else {
        render("processAnswer.eta", {
            tId: params.tId,
        }
        );

    };
    
};

export { addQuestion, deleteQuestion, listTopics,
        listQuestionsByTopic, addTopic, deleteTopic, addQuestionAnswerOption,
        listQuestionAnswerOptions, deleteQuestionAnswerOption,
        listQuizTopics, processTopicPick, quizQuestion,
        checkAnswer, processAnswer };