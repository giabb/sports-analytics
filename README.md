# Sports Analytics

This project was developed during the 2019 Visual Analytics Course held by [Prof. Santucci](http://www.diag.uniroma1.it/users/giuseppe_santucci) at [Sapienza University of Rome](https://www.uniroma1.it/)

The database used in this project is free and [available on Kaggle](https://www.kaggle.com/stefanoleone992/fifa-20-complete-player-dataset).

## Getting Started

It is possible to live play the web dashboard by [clicking here](https://giabb.github.io/sports-analytics/) .

If you want to execute the code offline, just download the project and open it in your preferred browser.

### Prerequisites

If you just execute the code, you don't need anything else.

If you want to reproduce the [preprocessing](#preprocessing), you will need:

- Python3
- (optional) Jupyter Notebook ``` pip install jupyterlab ```
- Numpy ``` pip install numpy ```
- Pandas ``` pip install pandas ```
- Scikit-learn ``` pip install scikit-learn ```

## Preprocessing

The dataset used in this project is publicly [available on Kaggle](https://www.kaggle.com/stefanoleone992/fifa-20-complete-player-dataset#players_20.csv) . 
From the whole dataset, we used the files players_15.csv, players_16.csv, players_17.csv, players_18.csv, players_19.csv, players_20.csv. From the last file, during preprocessing we took the first 4000 players (out of 18000+), restricting attributes from 104 to 'sofifa_id', 'short_name', 'age', 'nationality', 'overall', 'player_positions', 'pace', 'shooting', 'passing', 'dribbling', 'defending', 'physic'.
Moreover, since the last 6 attributes refer to outfield players, goalkeepers attributes were different from these so, we translated the attributes 'gk_diving', 'gk_handling', 'gk_kicking', 'gk_reflexes', 'gk_speed', 'gk_positioning' in order to fill the same 6 values in the data frame. 
About roles, we collapsed all the roles in 4 macro-roles: Defenders (D), Mid-fielders (M), Forwards (F) and Goalkeepers (GK). 
From the other files of the dataset we took the overall score of the previously mentioned 4000 players for each year, using them to plot the progress of these players from FIFA 15 to FIFA 20. 
Furthermore, we computed the PCA of the 6 main attributes of each player, performed some adjustment to the data and appended for each player an url containing his image.
The whole preprocessing is available at /py/preprocessing.py. 
We used numpy and pandas in order to manage the datasets, along with sklearn decomposition with whitening to compute PCA.
A summary image between original, normalized and whitened data is:

![img_whiten](https://raw.githubusercontent.com/giabb/sports-analytics/main/md_img/whiten.jpg)

## To be fixed

Back in 2020 the table containing player names,  hovering with the mouse, also prompted an image of the player. From 2021, SOFIFA changed the structure of the paths were the players' images are stored. The fix should be quick and simple, but since we discontinued the project, it is not our priority to fix it soon. We will eventually fix it, but if anyone wants to do it to have the feature working back ASAP, create a PR and we will be happy to cite everyone contributing the project.

## Authors

[@giabb](https://github.com/giabb) - [@FabioDiS](https://github.com/FabioDiS)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

