export KALDI_ROOT=/home/ubuntu/kaldi
export LD_LIBRARY_PATH=$KALDI_ROOT/src/lib:$KALDI_ROOT/tools/openfst-1.7.2/lib:$KALDI_ROOT/src/latbin:$KALDI_ROOT/src/online2/lib

[ -f $KALDI_ROOT/tools/env.sh ] && . $KALDI_ROOT/tools/env.sh
export PATH=$PWD/utils/:$KALDI_ROOT/tools/openfst/bin:$PWD:$PATH
[ ! -f $KALDI_ROOT/tools/config/common_path.sh ] && echo >&2 "The standard file $KALDI_ROOT/tools/config/common_path.sh is not present -> Exit!" && exit 1
. $KALDI_ROOT/tools/config/common_path.sh
export LC_ALL=ko_KR.UTF-8
