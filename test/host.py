import shlex
from os.path import dirname, realpath
from subprocess import call, Popen
from os.path import dirname, join, realpath

class Localhost:

    def __init__(self):
        # kill existing process
        call(shlex.split("pkill -f 'python -m SimpleHTTPServer 8000'"))

    def start(self):
        path_to_directory_of_this_file = dirname(realpath(__file__))
        print "path_to_directory_of_this_file:", path_to_directory_of_this_file
        path_to_root_directory = join(path_to_directory_of_this_file, "..")
        print "path_to_root_directory:", path_to_root_directory
        path_to_docs = join(path_to_root_directory, "docs")
        print "path_to_docs:", path_to_docs

        self.process = Popen(shlex.split("python -m SimpleHTTPServer 8000"), cwd=path_to_docs)

    def end(self):
        self.process.kill()
