import axios from "axios";


export const createRequest = async ({ endpoint, method, body, headers }: any) => {
  let res;
  try {
    res = await axios({
      method,
      url: domain + endpoint,
      data: body,
      headers: { "Content-Type": "application/json", ...headers }
    })
  } catch (e: any) {
    console.log(e)
  }

  return res?.data
}

export const domain = "http://localhost:4001";