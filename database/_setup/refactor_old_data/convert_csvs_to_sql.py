import csv
import os

# Get the directory where the script lives
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

input_dir = BASE_DIR + '/new_csvs'
output_dir = BASE_DIR + '/sql_queries'

# Make sure output directory exists
os.makedirs(output_dir, exist_ok=True)

# Process each CSV file
for filename in sorted(os.listdir(input_dir)):
    if filename.endswith('.csv'):
        filename_no_ext = os.path.splitext(filename)[0]  # e.g., "01_players"
        prefix, table_name = filename_no_ext.split('_', 1)  # "01", "players"

        csv_path = os.path.join(input_dir, filename)
        sql_path = os.path.join(output_dir, f'{prefix}_fill_{table_name}.sql')

        with open(csv_path, 'r', newline='', encoding='utf-8') as f_csv:
            reader = csv.reader(f_csv)
            headers = next(reader)
            columns = ', '.join(f'`{col}`' for col in headers)

            insert_statements = []

            for row in reader:
                escaped_values = []
                for value in row:
                    if value != '':
                        escaped = value.replace("'", "\\'")
                        escaped_values.append(f"'{escaped}'")
                    else:
                        escaped_values.append("NULL")

                values = ', '.join(escaped_values)
                stmt = f"INSERT INTO `{table_name}` ({columns}) VALUES ({values});"
                insert_statements.append(stmt)

        with open(sql_path, 'w', encoding='utf-8') as f_sql:
            f_sql.write(f'DELETE FROM `{table_name}`;\n')
            for stmt in insert_statements:
                f_sql.write(stmt + '\n')

        print(
            f"✅ Generated {len(insert_statements)} statements for '{table_name}' in '{os.path.basename(sql_path)}'")
