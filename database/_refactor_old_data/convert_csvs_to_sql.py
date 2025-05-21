import csv
import os

# Get the directory where the script lives
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

input_dir = BASE_DIR + '/new_csvs'
output_dir = BASE_DIR + '/sql_queries'

# Make sure output directory exists
os.makedirs(output_dir, exist_ok=True)

# Process each CSV file
for filename in os.listdir(input_dir):
    if filename.endswith('.csv'):
        table_name = os.path.splitext(filename)[0]
        csv_path = os.path.join(input_dir, filename)
        sql_path = os.path.join(output_dir, f'fill_{table_name}.sql')

        with open(csv_path, 'r', newline='', encoding='utf-8') as f_csv:
            reader = csv.reader(f_csv)
            headers = next(reader)
            columns = ', '.join(f'`{col}`' for col in headers)

            insert_statements = []

            for row in reader:
                values = ', '.join(
                    f"'{value.replace('\'', '\\\'')}'" if value != '' else 'NULL'
                    for value in row
                )
                stmt = f"INSERT INTO `{table_name}` ({columns}) VALUES ({values});"
                insert_statements.append(stmt)

        with open(sql_path, 'w', encoding='utf-8') as f_sql:
            f_sql.write(f'DELETE FROM `{table_name}`;\n')
            for stmt in insert_statements:
                f_sql.write(stmt + '\n')

        print(
            f"✅ Generated {len(insert_statements)} statements for '{table_name}' in '{sql_path}'")
