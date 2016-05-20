#!/usr/bin/python3

from slimit import minify

VERSION = '1.1.0'

with open('jsleri.js', 'r') as f:
    content = f.read().replace('$VERSION$', VERSION)

with open('builds/jsleri-{}.js'.format(VERSION), 'w') as f:
    f.write(content)

top_comment = content[0:content.index('*/')+2]

with open('builds/jsleri-{}.min.js'.format(VERSION), 'w') as f:
    f.write(top_comment + '\n' + minify(''.join(content), mangle=True, mangle_toplevel=True))



print('Finished deploy, version: {}'.format(VERSION))

# create RPM: alien -r -c --scripts --target=x64 -v file.deb
