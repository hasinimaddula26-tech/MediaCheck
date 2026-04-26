import dash
from dash import dcc, html
import plotly.express as px
import pandas as pd
import numpy as np
import urllib.request
import json

# Setup Dash app
app = dash.Dash(__name__)
app.title = "Cancer Cases Dashboard"

# 1. Load GeoJSON for India States
geojson_url = "https://gist.githubusercontent.com/jbrobst/56c13bbbf9d97d187fea01ca62ea5112/raw/e388c4cae20aa53cb5090210a42ebb9b765c0a36/india_states.geojson"
try:
    with urllib.request.urlopen(geojson_url) as response:
        india_geojson = json.loads(response.read().decode())
except Exception as e:
    print(f"Failed to load GeoJSON: {e}")
    india_geojson = {}

# Exact state names from the GeoJSON
states = [
    'Andaman & Nicobar Island', 'Andhra Pradesh', 'Arunanchal Pradesh', 'Assam', 'Bihar', 
    'Chandigarh', 'Chhattisgarh', 'Dadara & Nagar Havelli', 'Daman & Diu', 'NCT of Delhi', 
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu & Kashmir', 'Jharkhand', 
    'Karnataka', 'Kerala', 'Lakshadweep', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Puducherry', 'Punjab', 'Rajasthan', 
    'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
]

# 2. Generate Synthetic Data
np.random.seed(42)
cancer_types = ['Lung Cancer', 'Breast Cancer', 'Skin Cancer', 'Blood Cancer (Leukemia)', 'Oral Cancer', 'Stomach Cancer']

data = []
for state in states:
    # Base randomly simulated population factor 
    base_population_factor = np.random.randint(50, 500)
    for c_type in cancer_types:
        # Give different relative frequencies
        freq = {'Lung Cancer': 1.2, 'Breast Cancer': 1.5, 'Skin Cancer': 0.6, 
               'Blood Cancer (Leukemia)': 0.9, 'Oral Cancer': 1.4, 'Stomach Cancer': 0.8}
        
        cases = int(np.random.poisson(base_population_factor * freq[c_type]))
        data.append({'State': state, 'Cancer Type': c_type, 'Cases': cases})

df = pd.DataFrame(data)

# Aggregated data for Choropleth Map
map_df = df.groupby('State')['Cases'].sum().reset_index()

# Aggregated data for Bar chart
bar_df = df.groupby('Cancer Type')['Cases'].sum().reset_index().sort_values(by='Cases', ascending=True)

# 3. Create Map Figure
fig_map = px.choropleth(
    map_df,
    geojson=india_geojson,
    featureidkey='properties.ST_NM',
    locations='State',
    color='Cases',
    color_continuous_scale="Reds",
    hover_name='State',
    title="Total Cancer Cases by State in India",
    labels={'Cases': 'Total Cases'}
)
fig_map.update_geos(fitbounds="locations", visible=False)
fig_map.update_layout(
    margin={"r":0,"t":40,"l":0,"b":0},
    geo=dict(bgcolor='rgba(0,0,0,0)'),
    paper_bgcolor='rgba(0,0,0,0)',
    plot_bgcolor='rgba(0,0,0,0)',
    font=dict(color='#333', family="Arial"),
)

# 4. Create Bar Chart Figure
fig_bar = px.bar(
    bar_df, 
    x='Cases', 
    y='Cancer Type', 
    orientation='h',
    title="Total Cases by Cancer Type",
    color='Cases',
    color_continuous_scale="Blues",
    text='Cases',
    labels={'Cases': 'Total Cases'}
)
fig_bar.update_traces(textposition='outside')
fig_bar.update_layout(
    margin={"r":0,"t":40,"l":0,"b":0},
    paper_bgcolor='rgba(0,0,0,0)',
    plot_bgcolor='rgba(0,0,0,0)',
    font=dict(color='#333', family="Arial"),
    coloraxis_showscale=False # hide the colorbar to save space
)

# 5. Dashboard Layout Structure
app.layout = html.Div(
    style={'backgroundColor': '#f8f9fa', 'padding': '20px', 'fontFamily': 'Arial, sans-serif', 'minHeight': '100vh'},
    children=[
        html.H1(
            "Cancer Data Visualization Dashboard",
            style={'textAlign': 'center', 'color': '#2c3e50', 'marginBottom': '30px', 'fontWeight': 'bold'}
        ),
        
        # Container for visuals using Flexbox for side-by-side responsiveness
        html.Div(
            style={
                'display': 'flex',
                'flexWrap': 'wrap',
                'gap': '20px',
                'justifyContent': 'center',
                'alignItems': 'stretch'
            },
            children=[
                # Map Region
                html.Div(
                    style={
                        'flex': '1 1 500px', # Allow growing/shrinking
                        'backgroundColor': 'white',
                        'borderRadius': '10px',
                        'boxShadow': '0 4px 6px rgba(0,0,0,0.1)',
                        'padding': '20px'
                    },
                    children=[
                        dcc.Graph(id='india-map', figure=fig_map, style={'height': '500px'})
                    ]
                ),
                
                # Bar Chart Region
                html.Div(
                    style={
                        'flex': '1 1 400px',
                        'backgroundColor': 'white',
                        'borderRadius': '10px',
                        'boxShadow': '0 4px 6px rgba(0,0,0,0.1)',
                        'padding': '20px'
                    },
                    children=[
                        dcc.Graph(id='bar-chart', figure=fig_bar, style={'height': '500px'})
                    ]
                )
            ]
        ),
        
        # Bottom text
        html.Div(
            "Data displayed is synthetically generated for demonstration purposes. Built with Dash & Plotly.",
            style={'textAlign': 'center', 'marginTop': '30px', 'color': '#7f8c8d', 'fontSize': '14px'}
        )
    ]
)

if __name__ == '__main__':
    # Running server locally
    app.run(debug=True, port=8050)
