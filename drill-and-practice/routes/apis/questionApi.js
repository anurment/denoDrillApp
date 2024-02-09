import { sql } from "../../database/database.js";



const getQuestionAnswerOptionsApi = async (questionId) => {
    const rows = await sql`SELECT id, option_text FROM question_answer_options WHERE question_id=${questionId}`;
    return rows;
};

const checkAnswer = async (questionId, optionId) => {
    const rows = await sql`SELECT is_correct FROM question_answer_options WHERE id=${optionId} AND question_id=${questionId}`;
    return rows[0];
};


const getRandomQuestionApi = async ({response}) => {
    //random question from random topic
    //test: curl localhost:7777/api/questions/random

    const rows = await sql`SELECT id, question_text, topic_id FROM questions WHERE id IN (SELECT DISTINCT question_id FROM question_answer_options WHERE is_correct=TRUE) ORDER BY RANDOM() LIMIT 1`;

    if (rows && rows.length > 0) {
        const answerOptions = await getQuestionAnswerOptionsApi(rows[0].id);
        const options = [];
        answerOptions.forEach(answeroption => {
            options.push(
              {
                optionId: answeroption.id,
                optionText: answeroption.option_text,
              }  
            )
        });
        
        const questionObject = {
            questionId : rows[0].id,
            questionText: rows[0].question_text,
            answerOptions: options,
        };
        //console.log(questionObject);
        response.body = questionObject;

    } else {
        response.body = {};  
    }
};

const answerQuestionApi = async ({request, response}) => {
    //check answer
    //test: curl -X POST -d '{"questionId": 26,"optionId": 5}' localhost:7777/api/questions/answer
    const body = request.body({ type: "json" });
    const document = await body.value;
    if (document.questionId && document.optionId) {
        const answer = await checkAnswer(document.questionId, document.optionId)
        if (answer) {

            if (answer.is_correct) {
                response.body = { correct : true };
            } else{
                response.body = { correct : false };
            }
        }

    }
};

export{getRandomQuestionApi, answerQuestionApi};