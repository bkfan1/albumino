import {
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { useContext } from "react";
import { AlbumPageContext } from "@/contexts/AlbumPageContext";
import { BsEnvelope, BsLink45Deg } from "react-icons/bs";
import GenerateInvitationLinkForm from "../forms/invitation/GenerateInvitationLinkForm";
import SendAlbumInvitationEmailForm from "../forms/invitation/SendAlbumInvitationEmailForm";

export default function AddContributorToAlbumModal() {
  const { showAddContributorsForm, setShowAddContributorsForm } =
    useContext(AlbumPageContext);

  return (
    <>
      <Modal
        isOpen={showAddContributorsForm}
        onClose={() => setShowAddContributorsForm(false)}
        size={"lg"}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton/>

          <ModalHeader>Add contributors</ModalHeader>
          <ModalBody>
            <Tabs>
              <TabList>
                <Tab>
                  <Icon as={BsLink45Deg} mr={1} /> Link
                </Tab>
                <Tab>
                  <Icon as={BsEnvelope} mr={1} /> Email
                </Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <GenerateInvitationLinkForm />
                </TabPanel>
                <TabPanel>
                  <SendAlbumInvitationEmailForm />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
