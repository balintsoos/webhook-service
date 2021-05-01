import Axios from "axios";
import { Subscription } from "../../modules/subscriptions";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const baseUrl = process.env.WEB_BASE_URL!;

describe("Web process", () => {
  describe("GET /healthcheck", () => {
    it("should return 200", async () => {
      const response = await Axios.get(`${baseUrl}/healthcheck`);
      expect(response.status).toEqual(200);
    });
  });

  describe("POST /subsriptions", () => {
    it("should return 201", async () => {
      const response = await Axios.post(
        `${baseUrl}/subscriptions`,
        createSubscription()
      );
      expect(response.status).toEqual(201);
    });

    it("should return the given partner", async () => {
      const partner = 1;
      const response = await Axios.post(
        `${baseUrl}/subscriptions`,
        createSubscription({ partner })
      );
      expect(response.data.subscription).toEqual(
        jasmine.objectContaining({ partner })
      );
    });

    it("should return the given event", async () => {
      const event = "test";
      const response = await Axios.post(
        `${baseUrl}/subscriptions`,
        createSubscription({ event })
      );
      expect(response.data.subscription).toEqual(
        jasmine.objectContaining({ event })
      );
    });

    it("should return the given address", async () => {
      const address = "http://test.com";
      const response = await Axios.post(
        `${baseUrl}/subscriptions`,
        createSubscription({ address })
      );
      expect(response.data.subscription).toEqual(
        jasmine.objectContaining({ address })
      );
    });

    it("should return the secret", async () => {
      const response = await Axios.post(
        `${baseUrl}/subscriptions`,
        createSubscription()
      );
      expect(response.data.subscription).toEqual(
        jasmine.objectContaining({
          secret: jasmine.anything(),
        })
      );
    });

    it("should return 400 on bad payload", async () => {
      const badPayload = {};
      try {
        await Axios.post(`${baseUrl}/subscriptions`, badPayload);
      } catch (error) {
        expect(error.response.status).toEqual(400);
      }
    });
  });
});

function createSubscription(
  override?: Partial<Pick<Subscription, "partner" | "event" | "address">>
): Pick<Subscription, "partner" | "event" | "address"> {
  return {
    partner: 1,
    event: "e2e",
    address: "http://localhost:8080/test",
    ...override,
  };
}
