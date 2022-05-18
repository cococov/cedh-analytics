import os
import pandas as pd

sheet_id = '12PAVZLEDabYJj58IVsIZozyM2FS_tAtA'
sheet_name = 'Overview'
url = f'https://docs.google.com/spreadsheets/d/{sheet_id}/gviz/tq?tqx=out:csv&sheet={sheet_name}'
data = pd.read_csv(url)
data = data.dropna(axis=1)


print('Processing metagame data \033[92mDone!\033[0m')
print('Saving backup...')

dirname = os.path.realpath('.')
version_number = len(os.listdir(os.path.join(dirname, r'public/data/metagame')))
os.rename(os.path.join(dirname, r'public/data/metagame/metagame.json'), os.path.join(dirname, r'public/data/metagame/metagame_' + f"{version_number}.json"))

print('Backup saved \033[92mDone!\033[0m')
print('Saving new file...')

data.to_json(os.path.join(dirname, r'public/data/metagame/metagame.json'), orient='records')

print('\033[92mDB Updated!\033[0m')