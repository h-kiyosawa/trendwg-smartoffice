import { Layout } from "../index.tsx";
import CreateAccountForm from "../../islands/createAccountForm.tsx";

export default function register() {
  return (
    <Layout>
        <div>
          <CreateAccountForm />
        </div>
    </Layout>
  );
}
