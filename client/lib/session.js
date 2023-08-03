import { setCookie, parseCookies, destroyCookie } from "nookies";
import { http } from "../pages/api/http";

export const storeCookies = async (token) => {
  http.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  const { "xplore.token": oldToken } = await parseCookies();
  if (oldToken && oldToken.length > 0) {
    destroyCookie(undefined, "xplore.token");
    setCookie(undefined, "xplore.token", "", { maxAge: -1 });
  }

  await setCookie(null, "xplore.token", token, {
    path: "/",
    secure: false,
    SameSite: "None",
    maxAge: 24 * 60 * 60 /* 1 day*/,
  });
};

export const deleteCookies = async () => {
  const { "xplore.token": oldToken } = await parseCookies();
  if (oldToken && oldToken.length > 0) {
    destroyCookie(undefined, "xplore.token");
    return setCookie(undefined, "xplore.token", "", { maxAge: -1 });
  }
  return;
};
