import { Global } from "./Global";

export const GetProfile = async (userId, setState) => {
  try {
    const request = await fetch(Global.url + "/user/profile/" + userId, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
    });
    const data = await request.json();
    console.log("data", data);
    if (data.status == "success") {
      setState(data.user);
    }
    console.log("userprofile is: ", data.user);
    return data;
  } catch (error) {
    console.log(error);
  }
};
