<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>
  
  <xsl:template match="/">
    <html>
      <head>
        <title>PilotRecognition.com XML Sitemap</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: #f8fafc;
            color: #1e293b;
          }
          h1 {
            color: #1e293b;
            border-bottom: 3px solid #dc2626;
            padding-bottom: 10px;
          }
          .subtitle {
            color: #64748b;
            font-size: 14px;
            margin-bottom: 30px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }
          th {
            background: #1e293b;
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: 600;
          }
          td {
            padding: 12px;
            border-bottom: 1px solid #e2e8f0;
          }
          tr:hover {
            background: #f1f5f9;
          }
          a {
            color: #2563eb;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
          .priority-high {
            color: #dc2626;
            font-weight: bold;
          }
          .priority-medium {
            color: #f59e0b;
          }
          .priority-low {
            color: #64748b;
          }
          .count {
            background: #dc2626;
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
          }
        </style>
      </head>
      <body>
        <h1>
          <span style="color: #1e293b;">Pilot</span><span style="color: #dc2626;">Recognition</span>.com XML Sitemap
        </h1>
        <p class="subtitle">
          This is the XML sitemap for Google Search Console and other search engines. 
          <span class="count"><xsl:value-of select="count(s:urlset/s:url)"/> URLs</span>
        </p>
        
        <table>
          <thead>
            <tr>
              <th>URL</th>
              <th>Last Modified</th>
              <th>Change Frequency</th>
              <th>Priority</th>
            </tr>
          </thead>
          <tbody>
            <xsl:for-each select="s:urlset/s:url">
              <tr>
                <td>
                  <a href="{s:loc}" target="_blank">
                    <xsl:value-of select="s:loc"/>
                  </a>
                </td>
                <td><xsl:value-of select="s:lastmod"/></td>
                <td><xsl:value-of select="s:changefreq"/></td>
                <td>
                  <xsl:choose>
                    <xsl:when test="s:priority >= 0.9">
                      <span class="priority-high"><xsl:value-of select="s:priority"/></span>
                    </xsl:when>
                    <xsl:when test="s:priority >= 0.5">
                      <span class="priority-medium"><xsl:value-of select="s:priority"/></span>
                    </xsl:when>
                    <xsl:otherwise>
                      <span class="priority-low"><xsl:value-of select="s:priority"/></span>
                    </xsl:otherwise>
                  </xsl:choose>
                </td>
              </tr>
            </xsl:for-each>
          </tbody>
        </table>
        
        <p style="margin-top: 30px; color: #64748b; font-size: 12px;">
          Generated for PilotRecognition.com - Aviation Industry's First Pilot Recognition-Based Platform
        </p>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
