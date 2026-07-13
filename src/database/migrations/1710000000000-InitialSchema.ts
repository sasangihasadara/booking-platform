import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class InitialSchema1710000000000 implements MigrationInterface {
  name = 'InitialSchema1710000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'password',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'createdAt',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'users',
      new TableIndex({
        name: 'IDX_users_email',
        columnNames: ['email'],
        isUnique: true,
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'services',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'title',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'duration',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'price',
            type: 'real',
            isNullable: false,
          },
          {
            name: 'isActive',
            type: 'boolean',
            default: true,
          },
          {
            name: 'createdAt',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'bookings',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'customerName',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'customerEmail',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'customerPhone',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'serviceId',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'bookingDate',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'bookingTime',
            type: 'time',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'varchar',
            length: '20',
            default: "'PENDING'",
          },
          {
            name: 'notes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'bookings',
      new TableForeignKey({
        columnNames: ['serviceId'],
        referencedTableName: 'services',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createIndex(
      'bookings',
      new TableIndex({
        name: 'IDX_bookings_service_date_time',
        columnNames: ['serviceId', 'bookingDate', 'bookingTime'],
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('bookings', 'IDX_bookings_service_date_time');
    const table = await queryRunner.getTable('bookings');
    const foreignKey = table?.foreignKeys.find((fk) => fk.columnNames.includes('serviceId'));
    if (foreignKey) {
      await queryRunner.dropForeignKey('bookings', foreignKey);
    }
    await queryRunner.dropTable('bookings');
    await queryRunner.dropIndex('users', 'IDX_users_email');
    await queryRunner.dropTable('services');
    await queryRunner.dropTable('users');
  }
}
