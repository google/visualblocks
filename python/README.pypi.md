<!-- This README is displayed on the Python package page on PyPI. -->

# Visual Blocks in Google Colaboratory

Visual Blocks offers a Python package for use within [Google Colaboratory][]
notebooks.

[Google Colaboratory]: https://colab.research.google.com

## For Users

`!pip install visualblocks` and `import visualblocks` in your Colaboratory
notebooks. See the example notebooks in the directory [examples/](examples/).

## For Developers

`!pip install git+https://...` in a notebook installs the package straight from
the latest, unreleased source in Github. The notebooks in the [tests/](tests/)
directory use this method.

The directory [scripts/](scripts/) contains turnkey scripts for common
developer tasks such as building and uploading the Python distribution package.

### Build and upload package to TestPyPI

One time setup:

```bash
# Install `build`.
$ python3 -m pip install --upgrade build

# Install `twine`, and make sure its binary is in your PATH.
$ python3 -m pip install twine
```

Steps:

1. Update the version number in [pyproject.toml](python/pyproject.toml).
1. Run `rm -rf build` to clean up previous builds.
1. Run `scripts/package` to build the package.
1. Run `scripts/upload` to upload the package. You need to have the username and
   password ready.
