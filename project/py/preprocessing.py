#!/usr/bin/env python
# coding: utf-8

import pandas as pd
import numpy as np
from sklearn.decomposition import PCA
import os

print('Start Parsing.\nParsing year 2020')
data=pd.read_csv('../raw/players_20.csv')
restr=data[0:4000]
restr['player_url'].to_csv('../data/urlsTemp.csv',index=False)
restr=restr[['sofifa_id','short_name','age','nationality','overall','player_positions','pace','shooting','passing','dribbling','defending','physic']]

l1 = ['pace','shooting','passing','dribbling','defending','physic']
l2 = ['gk_diving','gk_handling','gk_kicking','gk_reflexes','gk_speed','gk_positioning']
roledic = {'GK':'GK','LS':'F','ST':'F','RS':'F','LW':'F','LF':'F','CF':'F','RF':'F','RW':'F','LAM':'M','CAM':'M','RAM':'M','LM':'M','LCM':'M','CM':'M','RCM':'M','RM':'M','LWB':'D','LDM':'D','CDM':'D','RDM':'D','RWB':'D','LB':'D','LCB':'D','CB':'D','RCB':'D','RB':'D'}

for i in range(restr.shape[0]):
    restr.loc[i,'player_positions']=roledic[restr.loc[i,'player_positions'].split(',')[0]]
    if np.isnan(restr.loc[i, 'pace']):
        for j,k in zip(l1,l2):
            restr.loc[i,j]=data.loc[i,k]

restr.columns = ['sofifa_id','short_name','age','nationality','overall20','player_positions','pace_diving','shooting_handling','passing_kicking','dribbling_reflexes','defending_speed','physic_positioning']
restr.to_csv('../data/data20.csv',index=False)

for year in range(15,20):
    print('Parsing year 20'+str(year))
    overyear='overall'+str(year)
    file='../raw/players_'+str(year)+'.csv'
    restr.join(pd.DataFrame(columns=[overyear]))
    data=pd.read_csv(file)
    restr2=data[['sofifa_id','overall']]
    for i in range(restr2.shape[0]):
        v = restr2.loc[i,'sofifa_id']
        if v in list(restr['sofifa_id']):
            q = restr.query('sofifa_id==@v').head().index[0]
            restr.loc[q,overyear] = restr2.loc[i,'overall']
            
restr.to_csv('../data/dataFull.csv',index=False)

overalls=data.iloc[:,12:17].join(data.iloc[:,4])
overalls.to_csv('../data/overalls.csv',index=False)

print('End parsing.')

label=['pace_diving','shooting_handling','passing_kicking','dribbling_reflexes','defending_speed','physic_positioning']
att=['Y1','Y2','Y3','Y4','Y5','Y6']
print('\nComputing PCA')
data=pd.read_csv('../data/data20.csv')
restr=data.loc[:,label[0]:label[-1]]
pca = PCA(n_components=6, whiten=True)
pca_result = pca.fit_transform(restr.values)
restr_pca = pd.DataFrame(columns=att)
for i,j in zip(att,range(6)):
    restr_pca[i] = pca_result[:,j]
restr_pca.to_csv('../data/pca.csv',index=False)
print('Done.')

print('\nGenerating JSON')
veryFull=pd.read_csv('../data/dataFull.csv').join(pd.read_csv('../data/pca.csv'))

dicTransf = {'Northern Ireland':'United Kingdom','Republic of Ireland':'Ireland','Scotland':'United Kingdom','Wales':'United Kingdom', 'England':'United Kingdom', 'China PR':'China', 'Korea Republic':'Korea'}
l = list(veryFull.loc[:,'nationality'])
for i, j in zip(l,range(len(l))):
    try:
        dicTransf[i]
        veryFull.loc[j,'nationality'] = dicTransf[i]
    except KeyError:
        pass
    
urls = pd.read_csv('../data/urlsTemp.csv')
l = list(urls['player_url'])
for i, ind in zip(l,range(len(l))):
    imgurl = 'http://cdn.sofifa.org/players/10/20/'+str(i.split('/')[4])+'.png'
    urls.iloc[ind] = imgurl
    
veryFull=veryFull.join(urls)
 
veryFull.to_csv('../data/dataVeryFull.csv', index=False)
veryFull.to_json('../data/dataVeryFull.json', orient='records', indent=4)
print('Done.')

os.remove('../data/data20.csv')
os.remove('../data/dataFull.csv')
os.remove('../data/overalls.csv')
os.remove('../data/pca.csv')
os.remove('../data/dataVeryFull.csv')
os.remove('../data/urlsTemp.csv')
