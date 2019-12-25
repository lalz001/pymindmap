#!/usr/bin/env python
import os
import re

from setuptools import setup, find_packages

classes = """
    Development Status :: 4 - Beta
    Intended Audience :: Developers
    License :: OSI Approved :: BSD License
    Topic :: System :: Distributed Computing
    Programming Language :: Python
    Programming Language :: Python :: 2
    Programming Language :: Python :: 2.7
    Programming Language :: Python :: 3
    Programming Language :: Python :: 3.3
    Programming Language :: Python :: 3.4
    Programming Language :: Python :: 3.5
    Programming Language :: Python :: 3.6
    Programming Language :: Python :: 3.7
    Programming Language :: Python :: Implementation :: CPython
    Programming Language :: Python :: Implementation :: PyPy
    Operating System :: OS Independent
"""
classifiers = [s.strip() for s in classes.split('\n') if s]

def get_requirements():
    base = os.path.abspath(os.path.dirname(__file__))
    return open(os.path.join(base, "pymindmap/requirements.txt")).read().splitlines()


setup(
    name='pymindmap',
    version='1.0.21',
    description='Python Mindmap',
    long_description=open('README.md').read(),
    author='lalz',
    author_email='lfz163453@163.com',
    url='https://github.com/lalz001/pymindmap',
    license='BSD',
    classifiers=classifiers,
    packages=find_packages(),
#     install_requires=['tornado>=5.0.0,<6.0.0; python_version<"3.5.2"',
# 'tornado>=5.0.0,<7.0.0; python_version>="3.5.2"'],
   install_requires=get_requirements(),
    extras_require={':python_version == "2.7"': ['futures']},

    package_data={'pymindmap': ['api/*.km','templates/*', 'frontend/dist/*.*',
                             'frontend/dist/**/*.*', 'frontend/dist/**/**/*.*']},
    entry_points={
        'console_scripts': [
            'pymindmap = pymindmap.__main__:main',
        ]
    },
)