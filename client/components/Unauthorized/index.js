import { Button, Popconfirm, Result } from "antd";
import { useRouter } from "next/navigation";
import React from "react";
import { deleteCookies } from "../../lib/session";

function UnauthorizedDisplay() {
  const router = useRouter();

  const confirm = (e) => {
    deleteCookies();
    router.reload();
  };
  const cancel = (e) => {
    return;
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "grid",
        placeItems: "center",
      }}
    >
      <Result
        status="error"
        title="Sorry, you are not authorized to access this page at this moment."
        subTitle="You need to logout in order to access this page."
        extra={[
          <>
            <Button
              type="primary"
              key="console"
              onClick={() => router.replace("/")}
            >
              Go Back
            </Button>
            <Popconfirm
              title="End session?"
              description="Are you sure to logout?"
              onConfirm={confirm}
              onCancel={cancel}
              okText="Yes"
              cancelText="No"
            >
              <Button key="Logout">Logout</Button>,
            </Popconfirm>
          </>,
        ]}
      />
    </div>
  );
}

export default UnauthorizedDisplay;
