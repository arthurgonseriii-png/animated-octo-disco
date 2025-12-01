import pandas as pd

df = pd.read_csv('test_data.csv')
df.to_excel('test_data.xlsx', index=False)
