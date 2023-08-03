import React, { useEffect, useState } from "react";
import { Button, Form, Input, message } from "antd";
import styles from "./styles.module.css";
import { useRouter } from "next/router";
import { storeCookies } from "../../lib/session";
import { http } from "../api/http";
import UnauthorizedDisplay from "../../components/Unauthorized";
import nookies from "nookies";

function Signup(ctx) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [, forceUpdate] = useState({});
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = (values) => {
    handleSignup();
  };
  const onFinishFailed = (errorInfo) => {
    messageApi.open({
      type: "error",
      content: errorInfo.errorFields[0].errors[0],
    });
  };

  const handleSignup = async () => {
    setLoading(true);
    http
      .post("users/register", { username: username.toLowerCase(), password })
      .then((response) => {
        const loggedUser = response.data;

        storeCookies(loggedUser.token);
        messageApi.open({
          type: "success",
          content: "Redirecting to app",
        });

        router.replace("/");
      })
      .catch((error) => {
        messageApi.open({
          type: "error",
          content: error?.response?.data ?? "Error login in. Try again later",
        });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    forceUpdate({});
    router.prefetch("/");
  }, []);

  if (ctx.props.user) {
    return <UnauthorizedDisplay />;
  }

  return (
    <div className={styles.Container}>
      {contextHolder}
      <Form
        className={styles.formContainer}
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 800,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        form={form}
      >
        <h1>Signup</h1>
        <button
          className={styles.signupButton}
          onClick={() => router.push("/login")}
        >
          Have an account? Login
        </button>
        <Form.Item
          label="Username"
          name="username"
          rules={[
            {
              required: true,
              message: "Please input your username!",
            },
            { min: 3, message: "Please enter a valid username" },
          ]}
        >
          <Input
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.currentTarget.value)}
          />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
            { min: 3, message: "Password must be at least 6 characters" },
          ]}
        >
          <Input.Password
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
          />
        </Form.Item>
        <Form.Item
          label="Confirm Pass"
          name="confirmPassword"
          dependencies={["password"]}
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
            { min: 3, message: "Password must be at least 6 characters" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The new password that you entered do not match!")
                );
              },
            }),
          ]}
        >
          <Input.Password
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.currentTarget.value)}
            placeholder="Confirm password"
          />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
          shouldUpdate
        >
          {() => (
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              disabled={
                !!form.getFieldsError().filter(({ errors }) => errors.length)
                  .length
              }
            >
              Signup
            </Button>
          )}
        </Form.Item>
      </Form>
    </div>
  );
}

Signup.getInitialProps = async (ctx) => {
  const { "xplore.token": token } = nookies.get(ctx);

  if (!token) return { props: { user: null } };

  return { props: { user: true } };
};

export default Signup;
