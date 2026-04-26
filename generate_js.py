import json

simData_original = [
    ['in-an', 80, '1.5 weeks', 'Low', 'andaman and nicobar'],
    ['in-ap', 8500, '3.8 weeks', 'High', 'andhra pradesh'],
    ['in-ar', 400, '2.0 weeks', 'Low', 'arunanchal pradesh'],
    ['in-as', 3500, '2.5 weeks', 'Medium', 'assam'],
    ['in-br', 15000, '5.0 weeks', 'High', 'bihar'],
    ['in-ch', 500, '1.2 weeks', 'Low', 'chandigarh'],
    ['in-ct', 3100, '2.6 weeks', 'Medium', 'chhattisgarh'],
    ['in-dn', 120, '1.8 weeks', 'Low', 'dadara and nagar havelli'],
    ['in-dd', 120, '1.8 weeks', 'Low', 'daman and diu'],
    ['in-dl', 4100, '2.1 weeks', 'Medium', 'nct of delhi'],
    ['in-ga', 200, '1.5 weeks', 'Low', 'goa'],
    ['in-gj', 7800, '3.1 weeks', 'Medium', 'gujarat'],
    ['in-hr', 3900, '2.4 weeks', 'Medium', 'haryana'],
    ['in-hp', 800, '1.9 weeks', 'Low', 'himachal pradesh'],
    ['in-jk', 1590, '2.7 weeks', 'Medium', 'jammu and kashmir'], # Combined with ladakh
    ['in-jh', 4200, '3.5 weeks', 'High', 'jharkhand'],
    ['in-ka', 7500, '2.8 weeks', 'Medium', 'karnataka'],
    ['in-kl', 3200, '1.4 weeks', 'Low', 'kerala'],
    ['in-ld', 15, '1.0 weeks', 'Low', 'lakshadweep'],
    ['in-mp', 9200, '4.1 weeks', 'High', 'madhya pradesh'],
    ['in-mh', 12000, '3.2 weeks', 'High', 'maharashtra'],
    ['in-mn', 350, '2.1 weeks', 'Low', 'manipur'],
    ['in-ml', 420, '2.3 weeks', 'Low', 'meghalaya'],
    ['in-mz', 180, '1.7 weeks', 'Low', 'mizoram'],
    ['in-nl', 250, '2.0 weeks', 'Low', 'nagaland'],
    ['in-or', 5600, '3.4 weeks', 'Medium', 'odisha'],
    ['in-py', 300, '1.3 weeks', 'Low', 'puducherry'],
    ['in-pb', 4500, '2.7 weeks', 'Medium', 'punjab'],
    ['in-rj', 8200, '4.5 weeks', 'High', 'rajasthan'],
    ['in-sk', 120, '1.6 weeks', 'Low', 'sikkim'],
    ['in-tn', 8900, '2.5 weeks', 'Medium', 'tamil nadu'],
    ['in-tg', 4800, '3.0 weeks', 'Medium', 'telangana'],
    ['in-tr', 460, '2.2 weeks', 'Low', 'tripura'],
    ['in-up', 18500, '5.1 weeks', 'High', 'uttar pradesh'],
    ['in-ut', 1200, '2.4 weeks', 'Low', 'uttarakhand'],
    ['in-wb', 10500, '4.2 weeks', 'High', 'west bengal']
]

lines = []
for row in simData_original:
    lines.append(f"                ['{row[4]}', {row[1]}, '{row[2]}', '{row[3]}']")

print("[\n" + ",\n".join(lines) + "\n            ];")
