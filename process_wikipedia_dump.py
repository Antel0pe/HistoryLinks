import time

page_tag_count = 0
title_tag_count = 0

start = time.time()

with open("sample.xml", encoding="utf8") as wikipedia_dump:
    for line in wikipedia_dump:
        if "<page" in line:
            page_tag_count += 1
            
        if "<title" in line:
            title_tag_count += 1
            
end = time.time()

print(f'Page tag count: {page_tag_count}')
print(f'Title tag count: {title_tag_count}')
print(f'Total elapsed time: {end - start}s')