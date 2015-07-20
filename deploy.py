#!/usr/bin/python3

from slimit import minify

VERSION = '1.0.3'

with open('lrparsing.js', 'r') as f:
    content = f.read().replace('$VERSION$', VERSION)

with open('builds/lrparsing-{}.js'.format(VERSION), 'w') as f:
    f.write(content)

top_comment = content[0:content.index('*/')+2]

with open('builds/lrparsing-{}.min.js'.format(VERSION), 'w') as f:
    f.write(top_comment + '\n' + minify(''.join(content), mangle=True, mangle_toplevel=True))



print('Finished deploy, version: {}'.format(VERSION))

# create RPM: alien -r -c --scripts --target=x64 -v file.deb
