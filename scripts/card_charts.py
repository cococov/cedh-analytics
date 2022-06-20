import os
import json
import pandas as pd

DIRNAME = os.path.realpath('.')
FOLDER_PATH = r'public/data'
FILE_PATH = FOLDER_PATH + r'/cards/competitiveCards.json'
OUT_PATH = FOLDER_PATH + r'/charts/cardAnalysis.json'
charts_data = {}

#calculations
data = pd.read_json(FILE_PATH, orient='records')
def color_identity_summarizer(color):
    '''Function to identify the color and colorless'''
    if color == 'W':
        return 'White'
    elif color == 'U':
        return 'Blue'
    elif color == 'B':
        return 'Black'
    elif color == 'R':
        return 'Red'
    elif color == 'G':
        return 'Green'
    elif color == '':
        return 'Colorless'
    elif len(color) >= 2:
        return 'Multicolor'
    else:
        return 'Error'
def get_occurrences(element):
    ''' getter de list para map'''
    return element.get('occurrences')
def naive_get_occurrences(dict_list):
    ''' naive function to recover data'''
    occurrences = []
    for i in dict_list:
        occurrences.append(i.get('occurrences'))
    return occurrences
#color pie chart
data['Color Identity'] = data['colorIdentity'].apply(color_identity_summarizer)
# print(data['Color Identity'].unique())
by_color = data[['Color Identity','occurrences']].groupby(by='Color Identity', axis=0).count()
# print(by_color)
by_color_dict = by_color.to_dict(orient='index')
charts_data['by_color'] = {'labels': list(by_color_dict.keys()), 
    'datasets':[{
            'label':'Color',
            #'data': list(map(list(by_color_dict.values()),get_occurrences)),
            'data': naive_get_occurrences(list(by_color_dict.values())), 
            'backgroundColor': ['rgba(21,11,0,1)', 'rgba(14,104,171,1)', 'rgba(128,128,128,1)', 'rgba(0,115,62,1)', 'rgba(255,215,0,1)', 'rgba(211,32,42,1)', 'rgba(249,250,244,1)']
}]}
#type distribution
by_type = data[['type','occurrences']].groupby(by='type', axis=0).count()
by_type_dict = by_type.to_dict(orient='index')
charts_data['by_type'] = {'labels': list(by_type_dict.keys()), 
    'datasets':[{
            'label':'Type',
            'data': naive_get_occurrences(list(by_type_dict.values())),
            'backgroundColor': '#422273'
}]}
#MV distirbution cmc column
by_mv = data[['cmc','occurrences']].groupby(by='cmc', axis=0).count()
by_mv_dict = by_mv.to_dict(orient='index')
card_values = list(by_mv_dict.keys())
cards_quantities = naive_get_occurrences(list(by_mv_dict.values()))
charts_data['by_mv'] = {'labels': card_values, 
    'datasets':[{
            'label':'Mana Value',
            'data': cards_quantities,
            'backgroundColor': '#422273' 
}]}

    # number of cards
number_cards = sum(cards_quantities)

    #avg mv
cards_by_value = sum(x * y for x, y in zip(card_values, cards_quantities))/number_cards
charts_data['quick'] = {'Average Mana Value': f'{cards_by_value:.2f}',
        'Number of cards': number_cards}
print(charts_data)

#destroys and generates new json
with open(OUT_PATH, "w") as outfile:
    json.dump(charts_data, outfile)