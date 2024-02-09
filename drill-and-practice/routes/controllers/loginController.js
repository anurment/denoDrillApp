import { bcrypt } from "../../deps.js";
import { validasaur } from "../../deps.js";
import * as userService from "../../services/userService.js";

const getCredentials = async (request) => {
    const body = request.body({ type: "form" });
    const params = await body.value;

    return {
        email: params.get("email"),
        password: params.get("password"),
    };

};

const processLogin = async ({request, response, state, render}) => {
    const credentials = await getCredentials(request);
    const userFromDatabase = await userService.findUserByEmail(credentials.email);
    if (userFromDatabase.length != 1) {
        credentials.error = "Invalid username or password."
        render("login.eta", credentials );
        return;
    }
    const user = userFromDatabase[0];
    const passwordMatches = await bcrypt.compare(
    credentials.password,
    user.password,
    );

    if (!passwordMatches) {
        credentials.error = "Invalid username or password."
        render("login.eta", credentials );
        return;
    }
    await state.session.set("authenticated", true);
    await state.session.set("user", user);
    response.redirect("/topics");

};

const logout = async ({response, state}) => {
    await state.session.set("authenticated", null);
    await state.session.set("user", null);
  
    response.redirect("/");
};

const showLoginForm = ({ render }) => {
    render("login.eta"); 
};

export {processLogin, showLoginForm, logout};