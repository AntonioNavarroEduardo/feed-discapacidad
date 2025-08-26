from setuptools import setup, find_packages

setup(
    name="multilingue-filter",
    version="1.0.0",
    packages=find_packages(where="src"),
    package_dir={"": "src"},
    install_requires=[
        "fasttext>=0.9.2",
        "pytest>=7.0.0",
        "pytest-cov>=4.0.0",
        "langdetect>=1.0.9"
    ]
)
