import csv

def CSVtoTXT(csvFile, txtFile):
    with open(csvFile, 'r', newline='', encoding='utf-8') as infile, open(txtFile, 'w', encoding='utf-8') as outfile:
        reader = csv.reader(infile)
        for row in reader:
            line = '\t'.join(row)  # You can use ' '.join(row) for space-separated
            outfile.write(line + '\n')

CSVtoTXT('WelcomeUsers.csv', 'WelcomeUsers.txt')
