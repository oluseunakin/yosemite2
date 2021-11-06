import {
  Button,
  Center,
  HStack,
  Text,
  Box,
  VStack,
  Link,
} from '@chakra-ui/react';
import { useState } from 'react';

export default function Pokemon({ team, pokemon, setTeam, old, extra }) {
  function addToTeam() {
    if (team.length < 6) {
      setTeam([pokemon, ...team]);
      old.unshift(pokemon);
    } else {
      extra(<Text>Max number of pokemon allowed in a team is 6</Text>);
    }
    return old;
  }

  function removeFromTeam() {
    setTeam(old => old.filter(value => pokemon.id !== value.id));
    return old.filter(value => pokemon.id !== value.id);
  }

  const [render, setRender] = useState();
  const [clicked, setClicked] = useState();
  const inTeam = team.find(value => pokemon.id === value.id);
  return (
    <VStack spacing="3" mb="3">
      <Center>
        {extra ? (
          <Link
            fontSize="3xl"
            fontWeight="semibold"
            onClick={() => {
              extra(
                <Pokemon
                  team={team}
                  setTeam={setTeam}
                  pokemon={pokemon}
                  old={old}
                />
              );
            }}
          >
            {pokemon.name}
          </Link>
        ) : (
          <Text fontSize="3xl" fontWeight="semibold">
            {pokemon.name}
          </Text>
        )}
      </Center>
      <HStack>
        <Button
          size="sm"
          onClick={() => {
            if (clicked === 'abilities') {
              setClicked();
              setRender();
            } else {
              setClicked('abilities');
              setRender(
                <>
                  <Center>
                    <Text fontSize="2xl">---------- Abilities ----------</Text>
                  </Center>
                  {pokemon.abilities.map(ability => (
                    <>
                      <Text fontSize="xl">{ability.ability.name}</Text>
                      <Text>
                        This ability is {ability.is_hidden ? '' : 'not'} hidden
                      </Text>
                    </>
                  ))}
                </>
              );
            }
          }}
        >
          My Abilities
        </Button>
        <Button
          size="sm"
          onClick={() => {
            if (clicked === 'moves') {
              setClicked();
              setRender();
            } else {
              setClicked('moves');
              setRender(
                <Box>
                  <Text>----------Moves----------</Text>
                  {pokemon.moves.map(move => (
                    <Text fontSize="xl">{move.move.name}</Text>
                  ))}
                </Box>
              );
            }
          }}
        >
          My Moves
        </Button>
        {extra && (
          <Button
            size="sm"
            onClick={() =>
              localStorage.setItem(
                navigator.userAgent,
                JSON.stringify(
                  inTeam ? removeFromTeam(pokemon) : addToTeam(pokemon)
                )
              )
            }
          >
            {inTeam ? 'Remove' : 'Add'}
          </Button>
        )}
      </HStack>
      {render}
    </VStack>
  );
}
