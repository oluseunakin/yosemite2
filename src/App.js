import React, { useRef, useState, useEffect } from 'react';
import {
  ChakraProvider,
  Container,
  Center,
  Box,
  SimpleGrid,
  Input,
  Heading,
  theme,
  useDisclosure,
  Modal,
  ModalBody,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  Text
} from '@chakra-ui/react';
import Pokemon from './components/Pokemon';

function App() {
  const api = 'https://pokeapi.co/api/v2/pokemon/';
  const searchRef = useRef();
  const [content, setContent] = useState([]);
  let oldTeam = localStorage.getItem(navigator.userAgent)
    ? JSON.parse(localStorage.getItem(navigator.userAgent))
    : [];
  const [team, setTeam] = useState(oldTeam);
  const [search, setSearch] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    fetch(api).then(response => {
      response.json().then(r => {
        r.results.forEach((poke, i) => {
          fetch(poke.url).then(response =>
            response.json().then(pokemon => setContent(c => c.concat(pokemon)))
          );
        });
      });
    });
  }, []);

  function extra(data) {
    setSearch(data);
    onOpen();
  }
  return (
    <ChakraProvider theme={theme}>
      <Container>
        <Center m="5">
          <Heading>Welcome Hero</Heading>
        </Center>
        <Center>
          <Input
            placeholder="Press Enter to Search for a Pokemon"
            ref={searchRef}
            size="lg"
            onKeyPress={async e => {
              const search = searchRef.current.value;
              if (search.length > 0) {
                if (e.key === 'Enter') {
                  try {
                    const response = await (
                      await fetch(`${api}${search}`)
                    ).json();
                    extra(
                      <Pokemon
                        team={team}
                        pokemon={response}
                        setTeam={setTeam}
                        old={oldTeam}
                      />
                    );
                  } catch {
                    extra(<Heading as='h5' size='sm'>Pokemon not found</Heading>);
                  }
                }
              }
            }}
          />
        </Center>
        <Modal
          isOpen={isOpen}
          onClose={() => {
            searchRef.current.value = '';
            onClose();
          }}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalCloseButton />
            <ModalBody m="3">{search}</ModalBody>
          </ModalContent>
        </Modal>
      </Container>
      <SimpleGrid columns={[1, null, 2]} spacing="50px" mt="10">
        <Box>
          <Center mb="5">
            <Heading as="h3" size='lg'>My Team</Heading>
          </Center>
          {team.length > 0 ? (
            team.map((pokemon, i) => (
              <Pokemon
                key={i}
                team={team}
                pokemon={pokemon}
                setTeam={setTeam}
                old={oldTeam}
                extra={extra}
              />
            ))
          ) : (
            <Center>
              <Text size='md'>Assemble a team by adding pokemons</Text>{' '}
            </Center>
          )}
        </Box>

        <Box>
          <Center mb="5">
            <Heading as="h3" size='lg'>Pokemons</Heading>
          </Center>
          {content.map((pokemon, i) => (
            <Pokemon
              key={i}
              team={team}
              pokemon={pokemon}
              setTeam={setTeam}
              old={oldTeam}
              extra={extra}
            />
          ))}
        </Box>
      </SimpleGrid>
    </ChakraProvider>
  );
}

export default App;
