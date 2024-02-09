import { bcrypt } from "../../deps.js";
import { validasaur } from "../../deps.js";
import * as userService from "../../services/userService.js";

const registrationValidationRules = {
    email: [validasaur.required, validasaur.isEmail],
    password: [validasaur.required, validasaur.minLength(4)]
};

const getRegistrationData = async (request) => {
    const body = request.body({ type: "form" });
    const params = await body.value;
    return {
        email: params.get("email"),
        password: params.get("password"),
    };
};

const registerUser = async ({request, response, render}) => {
    const registrationData = await getRegistrationData(request);
    const [passes, errors] = await validasaur.validate(
        registrationData,
        registrationValidationRules,
    );

    if (!passes) {
        //console.log(errors); 
        render("registration.eta", {
            email: registrationData.email,
            validationErrors: errors,    
        });
        return;
    }
    const existingUser = await userService.findUserIdByEmail(registrationData.email);

    if (existingUser.length > 0) {

        render("registration.eta", {
            email: registrationData.email,
            validationErrors: { email: {exists: "email already registered" }},    
        });
        return;
    } else {
        //console.log(registrationData.errors.length);

        const hash = await bcrypt.hash(registrationData.password);
        await userService.addUser(registrationData.email, hash);
        response.body = "Registration successful!";
        response.redirect("/auth/login");
    }

};

const showRegistrationForm = ({ render }) => {
    render("registration.eta");
};

export { registerUser, showRegistrationForm };
