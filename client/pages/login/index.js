import React, { useEffect, useState } from "react";
import { Button, Checkbox, Form, Input, message } from "antd";
import styles from "./styles.module.css";
import { useRouter } from "next/router";
import { http } from "../api/http";
import { storeCookies } from "../../lib/session";

function Login() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [, forceUpdate] = useState({});
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = (values) => {
    handleLogin();
  };
  const onFinishFailed = (errorInfo) => {
    messageApi.open({
      type: "error",
      content: errorInfo.errorFields[0].errors[0],
    });
  };

  const handleLogin = async () => {
    setLoading(true);
    http
      .post("users/login", { username, password })
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
          maxWidth: 600,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        form={form}
      >
        <h1>Login</h1>
        <button
          className={styles.loginButton}
          onClick={() => router.push("/signup")}
        >
          New here? Signup
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
          name="remember"
          valuePropName="checked"
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Checkbox>Remember me</Checkbox>
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
              Log in
            </Button>
          )}
        </Form.Item>
      </Form>
    </div>
  );
}

export default Login;
