import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddRefreshTokenToUsers1710000001000 implements MigrationInterface {
  name = 'AddRefreshTokenToUsers1710000001000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'refreshToken',
        type: 'text',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'refreshToken');
  }
}
