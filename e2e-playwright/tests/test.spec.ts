import { test, expect } from '@playwright/test';

const TESTQUESTION = `Question: ${Math.random()}`;
const TESTANSWER1 = `Answer: ${Math.random()}`;
const TESTANSWER2 = `Answer: ${Math.random()}`;

test("If not logged in, user is directed to login page", async ({ browser }) => {
  const page = await browser.newPage({ storageState: undefined });

  await page.goto('/topics');
  await expect(page.getByRole('heading',{ name: "Login!" } )).toBeVisible();

  await page.goto('/quiz');
  await expect(page.getByRole('heading',{ name: "Login!" } )).toBeVisible();

});

test.use({ storageState: './auth/admin.json' });

test("Admin can add a topic", async ({ page }) => {

  await page.goto('/topics');
  //add a topic
  const topicName = `Topic: ${Math.random()}`;
  await page.getByRole('textbox').fill(topicName);
  await page.getByRole('button',{ name: "Add" } ).click();
  await expect(page.getByRole('link', {name : topicName})).toBeVisible();
});

test("Admin can add and remove a topic", async ({ page }) => {

  await page.goto('/topics');
  //add a topic
  const topicName = `Topic: ${Math.random()}`;
  await page.getByRole('textbox').fill(topicName);
  await page.getByRole('button',{ name: "Add" } ).click();
  await expect(page.getByRole('link', {name : topicName})).toBeVisible();

  //remove a topic
  await page.getByRole('listitem').filter({ hasText: topicName }).getByRole('button', { name: 'Delete topic' }).click();
  await expect(page.getByRole('listitem').filter({ hasText: topicName })).toHaveCount(0);

});

test.describe(() => {
  test.use({ storageState: './auth/user.json' });

  test("User cant add or remove a topic", async ({ page }) => {
    await page.goto('/topics');
    await expect(page.locator("input[type=submit]")).toHaveCount(0);
  });

  test("User can add a question", async ({ page }) => {
    
    //pick a topic
    await page.goto('/topics');
    const topicName = "Finnish language"; //pre-added topic
    await page.getByRole('link',{ name: topicName } ).click();

    //add a question
    const question = `Question: ${Math.random()}`;
    await page.getByRole('textbox').fill(question);
    await page.getByRole('button',{ name: "Add" } ).click();
    await expect(page.getByRole('link', {name : question})).toBeVisible();
  });

  test("User can add and delete question", async ({ page }) => {
    
    //pick a topic
    await page.goto('/topics');
    const topicName = "Finnish language"; //pre-added topic
    await page.getByRole('link',{ name: topicName } ).click();

    //add a question
    const question = `Question: ${Math.random()}`;
    await page.getByRole('textbox').fill(question);
    await page.getByRole('button',{ name: "Add" } ).click();
    await expect(page.getByRole('link', {name : question})).toBeVisible();

    //pick question
    await page.getByRole('link',{ name: question } ).click();
    await expect(page.getByText('Add an answer option!')).toBeVisible();

    //delete question
    await page.getByRole('button',{ name: "Delete question" }).click();
    await expect(page.getByRole('link',{ name: question } )).toHaveCount(0);
  });




  test("User can add and delete question answer option", async ({ page }) => {
    
    //pick a topic
    await page.goto('/topics');
    const topicName = "Finnish language"; //pre-added topic
    await page.getByRole('link',{ name: topicName } ).click();

    //add a question
    const question = `Question: ${Math.random()}`;
    await page.getByRole('textbox').fill(question);
    await page.getByRole('button',{ name: "Add" } ).click();
    await expect(page.getByRole('link', {name : question})).toBeVisible();

    //pick question
    await page.getByRole('link',{ name: question } ).click();
    await expect(page.getByText('Add an answer option!')).toBeVisible();

    //add answer option
    const ansOpt = `Answer: ${Math.random()}`;
    await page.getByRole('textbox').fill(ansOpt);
    await page.getByRole('button',{ name: "Add" } ).click();
    await expect(page.getByRole('listitem').filter({ hasText: ansOpt })).toBeVisible();

    //delete answer option
    await page.getByRole('listitem').filter({ hasText: ansOpt }).getByRole('button', { name: 'Delete option' }).click();
    await expect(page.getByRole('listitem').filter({ hasText: ansOpt })).toHaveCount(0);
  });

  test("User can play quiz", async ({ page }) => {

    //it is assumed that this is the only available question in the quiz db
    
    //pick a topic
    await page.goto('/topics');
    const topicName = "Finnish language"; //pre-added topic
    await page.getByRole('link',{ name: topicName } ).click();

    //add a question
    const question = TESTQUESTION;
    await page.getByRole('textbox').fill(question);
    await page.getByRole('button',{ name: "Add" } ).click();
    await expect(page.getByRole('link', {name : question})).toBeVisible();

    //pick question
    await page.getByRole('link',{ name: question } ).click();
    await expect(page.getByText('Add an answer option!')).toBeVisible();

    //add answer option1 (correct)
    const ansOpt1 = TESTANSWER1;
    await page.getByRole('textbox').fill(ansOpt1);
    await page.getByRole('checkbox').check();
    await page.getByRole('button',{ name: "Add" } ).click();
    await expect(page.getByRole('listitem').filter({ hasText: ansOpt1 })).toBeVisible();

    //add answer option2 (incorrect)
    const ansOpt2 = TESTANSWER2;
    await page.getByRole('textbox').fill(ansOpt2);
    await page.getByRole('button',{ name: "Add" } ).click();
    await expect(page.getByRole('listitem').filter({ hasText: ansOpt2 })).toBeVisible();

    //start quiz
    await page.goto('/quiz');
    await page.getByRole('link',{ name: topicName } ).click();
    await expect(page.getByRole('heading',{ name: question } )).toBeVisible();

    //pick opt1 (correct)
    await page.getByRole('listitem').filter({hasText: ansOpt1}).getByRole('button',{ name: "Choose" } ).click();
    await expect(page.getByRole('heading',{ name: "Correct!" } )).toBeVisible();

    await page.getByRole('button', {name: "Next question"}).click();

    //pick opt2 (incorrect)
    await page.getByRole('listitem').filter({hasText: ansOpt2}).getByRole('button',{ name: "Choose" } ).click();
    await expect(page.getByRole('heading',{ name: "Incorrect!" } )).toBeVisible();

    //await page.goto("/api/questions/random");
    //console.log(await page.content());

  });

  test("Test question api", async ({ request, }) => {

    const response = await request.get('/api/questions/random');
    const questionObject = await response.json();
    expect(questionObject.questionText).toContain(TESTQUESTION);
    //console.log(); 
  
  });
  
  test("Test answer api", async ({ request }) => {
    const response = await request.get('/api/questions/random');
    const questionObject = await response.json();
    const qId = questionObject.questionId;
    let ansId = 0;
    if (questionObject.answerOptions[0].option_text == TESTANSWER1){
      ansId = questionObject.answerOptions[0].id;
    } else {
      ansId = questionObject.answerOptions[1].id;
    }
  
    const answer = await request.post('/api/questions/answer', {
      data: {
      questionId: qId,
      optionId: ansId,
      }
    });
  
    const answerObject = await answer.json();
    expect(answerObject.correct).toBeTruthy();
  
  });

});
