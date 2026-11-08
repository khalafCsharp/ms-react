import { useNavigate, useLocation } from "react-router";
import { useAuth } from "../components/AuthProvider";

import { Info, LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";

function Login() {
  const { login, loading } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname ?? "/";

  const form = useForm();

  async function handleSubmitMethod({ email, password }) {
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (error) {
      if (
        error.response.status === 409 ||
        error.response.status === 404 ||
        error.response.status === 400
      ) {
        form.setError("root", {
          type: "Invalid Email or Password",
          message: "please check your credentials and try again",
        });
      }
      else{
         form.setError("root", {
          type: "connection",
          message: "Error, try again later",
        });
      }
    }
  }

  if (loading) return <LoaderCircle />;
  return (
    <div className="bg-background-light rounded-xl p-8 shadow-xl absolute top-60 left-1/2 -translate-x-1/2 ">
       <h2 className="text-text text-2xl font-bold mb-6 text-center">
          Login
        </h2>
    <form
      onSubmit={form.handleSubmit(handleSubmitMethod)}
      action=""
      className=""
    >
     
          <div className="mb-4">
            <label className="block font-semibold mb-2 " htmlFor="">
            Email
          </label>
          <input
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="text"
            placeholder="Enter email"
            {...form.register("email", { required: "email is required" })}
          />
          </div>

        <p className="text-danger">
          {form.formState.errors?.email &&
            form.formState.errors.email.message}{" "}
        </p>
         <div className="mb-4">
          <label  className="block font-semibold mb-2 " htmlFor="">
            Password
          </label>
          <input
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter password"
            type="password"
            {...form.register("password", {
              required: "password is required",
            })}
          />
       </div>

      {form.formState.errors?.root && (
        <div className="bg-background-dark p-2 rounded-sm">
          <div className="flex justify-start gap-2  items-center">
            <Info className="text-danger size-8" />
            <span className="text-2xl text-danger">
              {form.formState.errors.root.type}
            </span>
          </div>
          <p className="text-danger text-lg">
            {form.formState.errors.root.message}
          </p>
        </div>
      )}
     <div className="grid grid-cols-2 gap-4 mt-8">
       <button className="primary-button" type="submit">
        Login
      </button>
      <button
        className="bg-background-light py-2 px-4 border border-border rounded-lg transition-all hover:bg-background duration-200 shadow-custom"
        onClick={() => {
          navigate("/");
        }}
        type="reset"
      >
        Cancel
      </button>
     </div>
    </form>
    </div>
  );
}

export default Login;
