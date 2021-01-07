const {
  tables: { COLORS },
} = require('../../config');

const { throwIfInvalid } = require('../../utils');

let pgClient;

async function createColor(color) {
  const timestamp = new Date();

  const res = await pgClient.query(
    `
      INSERT INTO ${COLORS}(color, created_at, updated_at, deleted_at)
        VALUES($1, $2, $3, $4)
      ON CONFLICT (color)
        DO UPDATE
          SET updated_at = excluded.updated_at
      RETURNING *
    `,
    [color, timestamp, timestamp, null],
  );

  return res.rows[0];
}

async function getColor(id) {
  const res = await pgClient.query(
    `SELECT *
        FROM ${COLORS}
      WHERE id = $1 AND deleted_at IS NULL
    `,
    [id],
  );

  return res.rows[0];
}

async function getAllColors() {
  const res = await pgClient.query(
    `SELECT * FROM ${COLORS} WHERE deleted_at IS NULL`,
  );

  return res.rows;
}

async function updateColor({ id, color }) {
  try {
    const res = await pgClient.query(
      `UPDATE ${COLORS}
        SET color = $1,
            updated_at = $2
        WHERE id = $3`,
      [color, new Date(), id],
    );

    return res.rows[0];
  } catch (err) {
    console.error(err.message || err);
    return throwIfInvalid(!err, 400, 'Table already has this color');
  }
}

async function deleteColor(id) {
  await pgClient.query(
    `UPDATE ${COLORS}
        SET deleted_at = $1
        WHERE id = $2`,
    [new Date(), id],
  );
  return true;
}

module.exports = client => {
  pgClient = client;

  return {
    createColor,
    getColor,
    getAllColors,
    updateColor,
    deleteColor,
  };
};
