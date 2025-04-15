const neo4j = require('neo4j-driver');

const resolvers = {
  Query: {
    characters: async (_, __, { driver }) => {
      const session = driver.session();
      try {
        const result = await session.run('MATCH (c:Characters) RETURN c');
        return result.records.map(record => record.get('c').properties);
      } catch (error) {
        console.error('❌ Error fetching characters:', error);
        return [];
      } finally {
        await session.close();
      }
    },

    character: async (_, { name }, { driver }) => {
      const session = driver.session();
      try {
        const result = await session.run(
          'MATCH (c:Characters {name: $name}) RETURN c',
          { name }
        );
        if (result.records.length > 0) {
          return result.records[0].get('c').properties;
        }
        return null;
      } catch (error) {
        console.error('❌ Error fetching character:', error);
        return null;
      } finally {
        await session.close();
      }
    }
  },

  Mutation: {
    createCharacter: async (_, { name, height, mass }, { driver }) => {
      const session = driver.session();
      try {
        const result = await session.run(
          'CREATE (c:Characters {name: $name, height: $height, mass: $mass}) RETURN c',
          { name, height, mass }
        );
        return result.records[0].get('c').properties;
      } catch (error) {
        console.error('❌ Error creating character:', error);
        return null;
      } finally {
        await session.close();
      }
    },

    updateCharacter: async (_, { name, mass, gender, birth_year }, { driver }) => {
      const session = driver.session();
      try {
        const result = await session.run(
          `
          MATCH (c:Characters {name: $name})
          SET c.mass = $mass,
              c.gender = $gender,
              c.birth_year = $birth_year
          RETURN c
          `,
          { name, mass, gender, birth_year }
        );
        return result.records[0].get('c').properties;
      } catch (error) {
        console.error('❌ Error updating character:', error);
        return null;
      } finally {
        await session.close();
      }
    },

    deleteCharacter: async (_, { name }, { driver }) => {
      const session = driver.session();
      try {
        // Check if character exists
        const checkResult = await session.run(
          'MATCH (c:Characters {name: $name}) RETURN c',
          { name }
        );

        if (checkResult.records.length === 0) {
          const msg = `Character with name "${name}" not found.`;
          console.log(msg);
          return msg;
        }

        // ✅ Corrected relationship deletion query
        await session.run(
          'MATCH (c:Characters {name: $name})-[r]-() DELETE r',
          { name }
        );

        // Delete node
        await session.run(
          'MATCH (c:Characters {name: $name}) DELETE c',
          { name }
        );

        const msg = `Character with name "${name}" deleted successfully.`;
        console.log(msg);
        return msg;
      } catch (error) {
        console.error('❌ Error deleting character:', error);
        return 'An error occurred while deleting the character.';
      } finally {
        await session.close();
      }
    }
  }
};

module.exports = resolvers;