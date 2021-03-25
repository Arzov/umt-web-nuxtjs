import { Amplify, Hub } from "@aws-amplify/core";
import { Auth } from "@aws-amplify/auth";
import { API } from "@aws-amplify/api";
import { Storage } from "@aws-amplify/storage";
import awsconfig from "~/aws-exports";

export default (ctx, inject) => {
    const AWS = {
        Amplify,
        Auth,
        API,
        Storage,
        Hub,
    };

    AWS.Amplify.configure(awsconfig.arv);

    inject("AWS", AWS);
};
