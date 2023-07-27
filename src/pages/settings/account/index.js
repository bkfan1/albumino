import ChangeAccountEmailForm from "@/components/ui/forms/settings/ChangeAccountEmailForm";
import ChangeAccountPasswordForm from "@/components/ui/forms/settings/ChangeAccountPasswordForm";
import AuthCommonLayout from "@/components/ui/layouts/AuthCommonLayout";
import {
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
import { BsEnvelope } from "react-icons/bs";
import { MdPassword } from "react-icons/md";

export default function AccountSettingsPage() {
  return (
    <>
      <AuthCommonLayout>
        <Flex as={"main"} flexDirection={"column"} flex={6} pr={8}>
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
      </AuthCommonLayout>
    </>
  );
}
