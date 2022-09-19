import { AuthProvider, useAuth } from "../../hooks/auth";
import { renderHook, act } from "@testing-library/react-hooks";

jest.mock("expo-auth-session", () => {
  return {
    startAsync: () => {
      return {
        type: "success",
        params: {
          access_token: "google_token",
        },
      };
    },
  };
});

describe("Auth Hook", () => {
  it("should be able to SignIn with google account existing", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            id: `userInfo.id`,
            email: `userInfo.email`,
            name: `userInfo.given_name`,
            photo: `userInfo.picture`,
            locale: `userInfo.locale`,
            verified_email: `userInfo.verified_email`,
          }),
      })
    ) as jest.Mock;

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });
    await act(() => result.current.signInWithGoogle());
    expect(result.current.user).toBeTruthy();
  });
});
