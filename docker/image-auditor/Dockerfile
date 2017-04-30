FROM node:4.3.1
MAINTAINER Nicolas Rod <nicolas.rod@heig-vd.ch>

#
# When we build the image, we copy the executable jar in the image file system. 
#
COPY src /opt/app/

WORKDIR /opt/app
RUN npm install

EXPOSE 4343

ENTRYPOINT ["node", "/opt/app/auditor.js"]