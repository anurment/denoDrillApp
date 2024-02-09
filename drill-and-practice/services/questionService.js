import { sql } from "../database/database.js";

const addQuestion = async (userId, topicId, questionText) => {
   await sql`INSERT INTO questions (user_id, topic_id, question_text) VALUES (${userId}, ${topicId}, ${questionText})`; 
};

const deleteQuestionById = async(questionId) => {
    await sql`DELETE FROM questions WHERE id=${questionId}`;
};

const deleteQuestionsByTopic = async (questionId, topicId) => {
    await sql`DELETE FROM question_answer_options WHERE question_id= ${questionId}`;
    await sql`DELETE FROM questions WHERE topic_id=${topicId}`;
    
 };

const listQuestionsByTopic = async (topicId) => {
    const rows = await sql`SELECT * FROM questions WHERE topic_id=${topicId}`;
    return rows;
};

const getTopicName = async (topicId) => {
    const rows = await sql`SELECT name FROM topics WHERE id=${topicId}`;
    return rows[0].name;
};

const getQuestionById = async (qId) => {
    const rows = await sql`SELECT * FROM questions WHERE id=${qId}`;

    return rows[0];
};

const listTopics = async () => {
    const rows = await sql`SELECT * FROM topics`;
    return rows;
};


const addTopic = async (userId, name) => {
    await sql`INSERT INTO topics (user_id, name) VALUES (${userId}, ${name})`; 
};

const deleteTopic = async (topicId) => {
    const questions = await listQuestionsByTopic(topicId);
    if(questions && questions.length > 0){
        for (const question of questions) {
            
            await deleteAllQAnsByQid(question.id);

            await deleteAllQAnsOptsByQid(question.id);
            
        }
    }
    await sql`DELETE FROM questions WHERE topic_id=${topicId}`
    await sql`DELETE FROM topics WHERE id=${topicId}`;
};

const deleteAllQAnsByQid = async (questionId) => {
    await sql`DELETE FROM question_answers WHERE question_id=${questionId}`;
};

const deleteAllQAnsOptsByQid = async (questionId) => {
    await sql`DELETE FROM question_answer_options WHERE question_id=${questionId}`;
};

const addQuestionAnswerOption = async (questionId, optionText, isCorrect) => {
    await sql`INSERT INTO question_answer_options (question_id, option_text, is_correct) VALUES (${questionId}, ${optionText}, ${isCorrect})`;

};

const deleteQuestionAnswerOption = async (optionId, questionId) => {
    
    const answerOptions = getQuestionAnswers(questionId, optionId);
    if(answerOptions && answerOptions.length > 0){
        answerOptions.forEach(answerOption => {
            if (answerOption.question_answer_option_id === optionId) {
                deleteQuestionAnswer(questionId, optionId);
            }
        });
    }

    await sql`DELETE FROM question_answer_options WHERE id=${optionId} AND question_id=${questionId}`;

};

const getQuestionAnswers = async (questionId, questionAnswerOptionId) => {
    const rows = await sql`SELECT * FROM question_answers WHERE question_id=${questionId} AND question_answer_option_id=${questionAnswerOptionId}`;
    return rows;
};

const deleteQuestionAnswer = async (questionId, questionAnswerOptionId) => {
    await sql`DELETE FROM question_answers WHERE question_id=${questionId} AND question_answer_option_id=${questionAnswerOptionId}`;
};


const getQuestionAnswerOptions = async (questionId) => {
    const rows = await sql`SELECT * FROM question_answer_options WHERE question_id=${questionId}`;
    return rows;
};

const getAnswerOptionById = async (optionId) => {
    const rows = await sql`SELECT * FROM question_answer_options WHERE id=${optionId}`;
    return rows[0];
};


const getReadyQuestions = async (topicId) => {
    const rows = await sql`SELECT id, question_text, topic_id FROM questions WHERE id IN (SELECT DISTINCT question_id FROM question_answer_options WHERE is_correct=TRUE)` ;
    //console.log(rows);
    return rows;
};

const getReadyTopics = async () => {

    //selects ids and names from topics where there is atleast one question 
    //with atleast one correct anwer option for the quiz
    const rows = await sql`SELECT id, name FROM topics WHERE id IN ( (SELECT DISTINCT topic_id FROM questions WHERE id IN (SELECT DISTINCT question_id FROM question_answer_options WHERE is_correct=TRUE) ) )`;
    //console.log(rows);
    return rows;
};

const getUnReadyTopics = async () => {


    const rows = await sql`SELECT id, name FROM topics WHERE id NOT IN ( (SELECT DISTINCT topic_id FROM questions WHERE id IN (SELECT DISTINCT question_id FROM question_answer_options WHERE is_correct=TRUE) ) )`;
    //console.log(rows);
    return rows;

};


const getQuestionAndAnswers = async (topicId) => {
    const rows = await sql`SELECT questions.id, questions.question_text, (SELECT option_text, is_correct FROM question_answer_options)
    FROM questions INNER JOIN question_answer_options ON questions.id=question_answer_options.question_id WHERE questions.topic_id=${topicId}`;
    return rows;
};

const getTopicIds = async () => {
    const rows = await sql`SELECT id, name FROM topics`;
    return rows;
};

const getRandomQuestion = async (topicId) => {
    const rows = await sql`SELECT id, question_text, topic_id FROM questions WHERE id IN (SELECT DISTINCT question_id FROM question_answer_options WHERE is_correct=TRUE) AND topic_id=${topicId} ORDER BY RANDOM() LIMIT 1`;

    if (rows && rows.length > 0) {
        const answerOptions = await getQuestionAnswerOptions(rows[0].id);
        const questionObject = {
            question: rows[0],
            answerOptions: answerOptions,
        };
        //console.log(questionObject);
        return questionObject;

    } else {
        return rows;  
    }
};

const recordAnswer = async(userId, questionId, answerId) => {
    await sql`INSERT INTO question_answers (user_id, question_id, question_answer_option_id) VALUES (${userId}, ${questionId}, ${answerId})`;
};


const getCorrectAnswers = async (qId) => {
    const rows = await sql`SELECT * FROM question_answer_options WHERE question_id=${qId} AND is_correct=TRUE`;
    //console.log(rows)
    return rows;
};

const getNtopics = async () =>{
    const rows = await sql`SELECT COUNT(*) FROM topics`;
    return rows[0];
};

const getNquestions = async () =>{
    const rows = await sql`SELECT COUNT(*) FROM questions`;
    return rows[0];
};

const getNanswers = async () =>{
    const rows = await sql`SELECT COUNT(*) FROM question_answers`;
    return rows[0];
};






export {addQuestion, deleteQuestionsByTopic, listTopics, addTopic, deleteTopic,
        listQuestionsByTopic, getQuestionById, getTopicName,    
        addQuestionAnswerOption, getQuestionAnswerOptions,
        deleteQuestionAnswerOption, getQuestionAnswers,
        getQuestionAndAnswers, getTopicIds, getReadyQuestions,
        getReadyTopics, getUnReadyTopics, getRandomQuestion,
        getAnswerOptionById, getCorrectAnswers, getNtopics, getNquestions, getNanswers, deleteQuestionById, recordAnswer};