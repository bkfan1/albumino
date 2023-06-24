import Layout from "@/components/ui/Layout";
import ChangeAccountEmailForm from "@/components/ui/forms/ChangeAccountEmailForm";
import ChangeAccountPasswordForm from "@/components/ui/forms/ChangeAccountPasswordForm";
import {
  Box,
  Flex,
  Heading,
  Icon,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  VStack,
} from "@chakra-ui/react";
import { BsEnvelope, BsPass } from "react-icons/bs";
import { MdPassword } from "react-icons/md";

export default function AccountSettingsPage() {
  return (
    <>
      <Layout>
        <Flex as={"main"} flexDirection={"column"} flex={6}>
          <VStack as={"header"} width={"100%"} py={2}>
            <Heading width={"100%"}>Account settings</Heading>
          </VStack>
          <Tabs>
            <TabList>
              <Tab>
                <Icon as={BsEnvelope} mr={1} />
                Email
              </Tab>
              <Tab>
                <Icon as={MdPassword} mr={1} />
                Password
              </Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <ChangeAccountEmailForm />
              </TabPanel>
              <TabPanel>
                <ChangeAccountPasswordForm />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Flex>
      </Layout>
    </>
  );
}
