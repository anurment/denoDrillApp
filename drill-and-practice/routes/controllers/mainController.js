import * as questionService from "../../services/questionService.js";

const showMain = async ({ render }) => {
  render("main.eta",{
    ntopics: await questionService.getNtopics(),
    nquestions: await questionService.getNquestions(),
    nanswers: await questionService.getNanswers(),
  });
};

export { showMain };
