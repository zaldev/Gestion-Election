import { useState } from "react";
import type { NextPage } from "next";
import { useSession, signIn, getProviders } from "next-auth/react";
import axios from "axios";
import Router from "next/router";



const Auth: NextPage = ({ providers }: any) => {
  const { data: session } = useSession();
  const [authType, setAuthType] = useState("Login");
  const oppAuthType: { [key: string]: string } = {
    Login: "Register",
    Register: "Login",
  };

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const redirectToHome = () => {
    const { pathname } = Router;
    if (pathname === "/auth") {
      // TODO: redirect to a success register page
      Router.push("/");
    }
  };



  const loginUser = async () => {
    const res: any = await signIn("credentials", {
      redirect: false,
      email: email,
      password: password,
      callbackUrl: `${window.location.origin}`,
    });

    res.error ? console.log(res.error) : redirectToHome();
  };

  const formSubmit = (actions: any) => {
    actions.setSubmitting(false);

    loginUser();
  };

  return (<div></div>
  );
};

export default Auth;

export async function getServerSideProps() {
  return {
    props: {
      providers: await getProviders(),
    },
  };
}
