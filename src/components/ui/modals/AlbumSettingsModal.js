import { AlbumPageContext } from "@/contexts/AlbumPageContext";
import {
  Avatar,
  ButtonGroup,
  HStack,
  Icon,
  IconButton,
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
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useContext } from "react";
import { AiOutlineMinusCircle } from "react-icons/ai";
import { BsPeopleFill } from "react-icons/bs";

export default function AlbumSettingsModal({
  contributors,
  handleRemoveContributorFromAlbum,
}) {
  const { showAlbumSettings, setShowAlbumSettings } =
    useContext(AlbumPageContext);

  const router = useRouter();
  const { query } = router;
  const { albumId } = query;
  return (
    <>
      <Modal
        isOpen={showAlbumSettings}
        onClose={() => setShowAlbumSettings(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Album settings</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <Tabs>
              <TabList>
                <Tab>
                  {" "}
                  <Icon as={BsPeopleFill} mr={1} />
                  Contributors
                </Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <VStack width={"100%"}>
                    {contributors.map(({ id, firstname, lastname }) => (
                      <HStack
                        key={id}
                        width={"100%"}
                        justifyContent={"space-between"}
                      >
                        <HStack>
                          <Avatar name={`${firstname} ${lastname}`} size="sm" />
                          <Text>
                            {firstname} {lastname}
                          </Text>
                        </HStack>

                        <ButtonGroup>
                          <Tooltip label="Remove from album">
                            <IconButton
                              icon={<AiOutlineMinusCircle />}
                              colorScheme="red"
                              onClick={() =>
                                handleRemoveContributorFromAlbum(id, albumId)
                              }
                            />
                          </Tooltip>
                        </ButtonGroup>
                      </HStack>
                    ))}
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
