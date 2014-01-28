#!/usr/bin/perl

use strict;
use warnings;
use File::chdir;

my $count = 1;
my @paths = ('.');

while (my $path = shift @paths) {

    # prevent infinite loopes
    last if $count++ > 50;

    # change to submodule directory
    local $CWD = $path;

    next if !-f '.gitmodules';

    # init submodule command
    system qw/git submodule init/;

    # init individula submodules and add them to the list of submodules to be processed
    push @paths, map { /Submodule '([^']+)'/; $1 ? "$path/$1" : () } qx/git submodule update --init/;
}
