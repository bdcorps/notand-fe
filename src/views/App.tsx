import {
  Box,
  ContextView,
  Inline,
  Badge,
  TextArea,
  Link,
  Button,
  TextField,
  Divider,
} from "@stripe/ui-extension-sdk/ui";
import type { ExtensionContextValue } from "@stripe/ui-extension-sdk/context";

import BrandIcon from "./brand_icon.svg";
import { useCustomer } from "../utils/stripeApi";
import moment from "moment";
import { createRequest } from "../utils";
import { useEffect, useState } from "react";

const Notes = ({ notes }: any) => {
  return (
    <Box css={{ marginTop: "medium" }}>
      {notes.map((note, i) => {
        return (
          <Box key={`note_${i}`} css={{}}>
            <Box>
              <Inline css={{ font: "body", color: "primary" }}>
                {note.note}
              </Inline>
            </Box>

            <Box>
              <Inline css={{ font: "body", color: "disabled" }}>
                {moment().calendar()}
              </Inline>
            </Box>

            <Divider css={{ marginY: "medium" }} />
          </Box>
        );
      })}
    </Box>
  );
};

const App = ({ userContext, environment }: ExtensionContextValue) => {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);

  const customerId = environment?.objectContext?.id;
  const customer = useCustomer(customerId);

  useEffect(() => {
    getNotesAPI();
  }, [customer]);

  const getNotesAPI = () => {
    if (!customer) {
      return;
    }

    createRequest({
      endpoint: `/notes/${customerId}`,
      body: {},
      method: "GET",
    }).then((data: any) => {
      if (!data.error) {
        const notes = data.data;

        notes.sort((a: any, b: any) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return dateA > dateB ? 1 : -1;
        });

        setNotes(notes);
      }
    });
  };

  const addNoteAPI = async () => {
    if (!customer || !note) {
      return;
    }

    await createRequest({
      endpoint: "/note",
      body: { note, id: customerId, name: customer?.name },
      method: "POST",
    });

    getNotesAPI();
  };

  // const notes = [
  //   "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
  //   "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. ",
  // ];
  return (
    <ContextView
      title={customer?.name || "Customer"}
      brandColor="#F6F8FA" // replace this with your brand color
      brandIcon={BrandIcon} // replace this with your brand icon
    >
      <Box css={{ stack: "y" }}>
        <Box css={{ marginBottom: "xlarge" }}>
          <Badge type="positive" css={{ marginRight: "small" }}>
            Qualified
          </Badge>

          <Badge type="info" css={{ margin: "small" }}>
            Owned by Blake
          </Badge>

          <Badge type="urgent" css={{ marginRight: "small" }}>
            To close this month
          </Badge>
          {/* <TextField
            label="Email"
            placeholder="name@email.com"
            disabled
            defaultValue={customer?.email}
            css={{ paddingY: "small" }}
          /> */}

          <Box css={{ paddingY: "medium" }}>
            <Box
              css={{ width: "fill", stack: "x", distribute: "space-between" }}
            >
              <Box>
                <Inline
                  css={{
                    font: "body",
                    color: "primary",
                    paddingY: "medium",
                    fontWeight: "bold",
                  }}
                >
                  Email
                </Inline>
              </Box>
              <Box>
                <Inline
                  css={{
                    font: "body",
                    color: "primary",
                    paddingY: "medium",
                  }}
                >
                  {customer?.email}
                </Inline>
              </Box>
            </Box>

            <Box
              css={{ width: "fill", stack: "x", distribute: "space-between" }}
            >
              <Box>
                <Inline
                  css={{
                    font: "body",
                    color: "primary",
                    paddingY: "medium",
                    fontWeight: "bold",
                  }}
                >
                  Company
                </Inline>
              </Box>
              <Box>
                <Inline
                  css={{
                    font: "body",
                    color: "primary",
                    paddingY: "medium",
                  }}
                >
                  Acme Inc.
                </Inline>
              </Box>
            </Box>

            <Box
              css={{ width: "fill", stack: "x", distribute: "space-between" }}
            >
              <Box>
                <Inline
                  css={{
                    font: "body",
                    color: "primary",
                    paddingY: "medium",
                    fontWeight: "bold",
                  }}
                >
                  Deal Size
                </Inline>
              </Box>
              <Box>
                <Inline
                  css={{
                    font: "body",
                    color: "primary",
                    paddingY: "medium",
                  }}
                >
                  $50K
                </Inline>
              </Box>
            </Box>
          </Box>

          <Box css={{}}>
            <TextArea
              label="Note"
              placeholder="Looking for more enterprise features like SEO..."
              value={note}
              css={{ paddingY: "medium" }}
              onChange={(e) => {
                setNote(e.target.value);
              }}
            />
            <Button
              type="primary"
              onPress={() => {
                addNoteAPI();
              }}
            >
              Add note
            </Button>
          </Box>
        </Box>

        <Box css={{}}>
          <Inline
            css={{
              font: "heading",
              color: "primary",
              fontWeight: "semibold",
              paddingY: "medium",
            }}
          >
            View All Notes
          </Inline>

          <Notes notes={notes} />
        </Box>
      </Box>
      {/* <Box css={{ height: "fill", stack: "y", distribute: "space-between" }}>
       

        <Box
          css={{
            background: "container",
            borderRadius: "medium",
            marginTop: "small",
            padding: "large",
          }}
        ></Box>

        <Box css={{ color: "secondary" }}>
          <Box css={{ marginBottom: "medium" }}>
            Learn more about views, authentication, and accessing data in{" "}
            <Link
              href="https://stripe.com/docs/stripe-apps"
              target="blank"
              type="secondary"
            >
              Stripe Apps docs
            </Link>
            .
          </Box>

          <Box css={{ marginBottom: "medium" }}>
            Questions? Get help with your app from the{" "}
            <Link
              href="https://github.com/stripe/stripe-apps/wiki/Developer-Support"
              target="blank"
              type="secondary"
            >
              Stripe Apps wiki
            </Link>
            .
          </Box>
        </Box>
      </Box> */}
    </ContextView>
  );
};

export default App;
